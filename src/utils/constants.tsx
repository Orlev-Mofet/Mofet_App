// export const BACKEND_API_URL        = "http://167.71.233.12/api/";
// export const BACKEND_STORAGE_URL    = "http://167.71.233.12/storage/";
export const BACKEND_API_URL        = "https://mofet-app.com/api/";
export const BACKEND_STORAGE_URL    = "https://mofet-app.com/storage/";
// export const BACKEND_API_URL        = "http://10.0.2.2:8000/api/";
// export const BACKEND_STORAGE_URL    = "http://10.0.2.2:8000/storage/";

// SK = Store Key
export const SK_TOKEN               = "_token";
export const SK_AGREE_POLICY        = "_agree_policy";
export const SK_PHONE_INFO          = "_phone_information";
export const SK_RESTART_TIME        = "_restart_time";
export const SK_USER_DATA           = "_user_data";
export const SK_OTP_CODE            = "_otp_code";


// ST = STatus
export const ST_ERROR               = "error";  
export const ST_SUCCESS             = "success";

export const FIELDS = [
    "Mathematics", 
    "Physics", 
    "Both", 
    "English"
];

// MP = Main Page
export const MP_SELECTED_WALL       = "selected_wall";
export const MP_SEARCH_TEXT         = "search_text";

export const APP_VERSION            = "3.0";

export const bytesToMB = (bytes: number) => {
    return bytes / (1024 * 1024); // 1 MB = 1024 * 1024 bytes
};