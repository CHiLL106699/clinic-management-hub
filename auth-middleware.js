/**
 * 診所授權檢查中間件
 * 用於在 LINE Bot Webhook 中檢查診所授權狀態
 */

const { createClient } = require('@supabase/supabase-js');

// 多診所管理資料庫設定
const MULTI_CLINIC_SUPABASE_URL = 'https://pizzpwesrbulfjylejlu.supabase.co';
const MULTI_CLINIC_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpenpwd2VzcmJ1bGZqeWxlamx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4NTU0NTIsImV4cCI6MjA0NzQzMTQ1Mn0.kBvSHCNBUlLkqjBnVDXm7Ry8vqaYpqULQUbfNyxFGbk';

const multiClinicSupabase = createClient(MULTI_CLINIC_SUPABASE_URL, MULTI_CLINIC_SUPABASE_KEY);

/**
 * 檢查診所授權狀態
 * @param {string} clinicSlug - 診所代碼
 * @returns {Promise<{authorized: boolean, message: string, clinic: object|null}>}
 */
async function checkClinicAuthorization(clinicSlug) {
  try {
    // 從資料庫查詢診所資訊
    const { data: clinic, error } = await multiClinicSupabase
      .from('clinics')
      .select('*')
      .eq('slug', clinicSlug)
      .single();

    if (error) {
      console.error('Error fetching clinic:', error);
      return {
        authorized: false,
        message: '無法查詢診所資訊',
        clinic: null
      };
    }

    if (!clinic) {
      return {
        authorized: false,
        message: '診所不存在',
        clinic: null
      };
    }

    // 檢查是否已授權
    if (!clinic.is_authorized) {
      return {
        authorized: false,
        message: '診所尚未授權，請聯繫管理員開通服務',
        clinic: clinic
      };
    }

    // 檢查訂閱狀態
    if (clinic.subscription_status !== 'active') {
      return {
        authorized: false,
        message: '診所訂閱未啟用，請聯繫管理員',
        clinic: clinic
      };
    }

    // 檢查訂閱是否過期
    if (clinic.subscription_end_date) {
      const endDate = new Date(clinic.subscription_end_date);
      const now = new Date();
      
      if (endDate < now) {
        return {
          authorized: false,
          message: '診所訂閱已過期，請聯繫管理員續約',
          clinic: clinic
        };
      }
    }

    // 所有檢查通過
    return {
      authorized: true,
      message: '授權有效',
      clinic: clinic
    };
  } catch (error) {
    console.error('Error in checkClinicAuthorization:', error);
    return {
      authorized: false,
      message: '系統錯誤，請稍後再試',
      clinic: null
    };
  }
}

/**
 * 生成未授權訊息
 * @param {string} message - 錯誤訊息
 * @returns {object} LINE 訊息物件
 */
function generateUnauthorizedMessage(message) {
  return {
    type: 'text',
    text: `❌ 服務暫時無法使用\n\n${message}\n\n如有疑問，請聯繫診所人員。`
  };
}

/**
 * 生成即將到期提醒訊息
 * @param {object} clinic - 診所資訊
 * @returns {object|null} LINE 訊息物件或 null
 */
function generateExpiryReminderMessage(clinic) {
  if (!clinic.subscription_end_date) return null;

  const endDate = new Date(clinic.subscription_end_date);
  const now = new Date();
  const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

  // 只在剩餘 7 天、3 天、1 天時提醒
  if (daysLeft === 7 || daysLeft === 3 || daysLeft === 1) {
    return {
      type: 'text',
      text: `⚠️ 訂閱即將到期提醒\n\n您的訂閱服務將於 ${daysLeft} 天後到期。\n\n為確保服務不中斷，請盡快聯繫管理員續約。`
    };
  }

  return null;
}

/**
 * Webhook 中間件：檢查授權並處理
 * @param {string} clinicSlug - 診所代碼
 * @param {function} next - 下一個處理函數
 * @returns {function} 中間件函數
 */
function authMiddleware(clinicSlug) {
  return async function(event, context) {
    // 檢查授權
    const authResult = await checkClinicAuthorization(clinicSlug);

    if (!authResult.authorized) {
      // 未授權，返回錯誤訊息
      return {
        statusCode: 200,
        body: JSON.stringify({
          messages: [generateUnauthorizedMessage(authResult.message)]
        })
      };
    }

    // 檢查是否需要發送到期提醒
    const reminderMessage = generateExpiryReminderMessage(authResult.clinic);
    if (reminderMessage) {
      // 可以在這裡發送提醒訊息給管理員
      console.log('Subscription expiry reminder:', reminderMessage);
    }

    // 授權通過，繼續處理
    return null; // 返回 null 表示繼續執行
  };
}

module.exports = {
  checkClinicAuthorization,
  generateUnauthorizedMessage,
  generateExpiryReminderMessage,
  authMiddleware
};
