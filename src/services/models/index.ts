export interface IUser {
  name: string;
  email: string;
}

export interface ILoginWithSocialType {
  user_token: string;
  device_uuid: string;
  device_type: string;
}

export interface ISignUpWithEmail {
  phone_number?: string;
  full_name?: string;
  user_email: string;
  device_type: string;
  device_uuid: string;
  re_password: string;
  user_password: string;
  // "device_signature": "112667336037344462475"
}

export interface ILoginWithPass {
  phone_number?: string;
  user_email?: string;
  device_type: string;
  device_uuid: string;
  user_password: string;
  // "device_signature": "112667336037344462475"
}

export interface IRequestNewPass {
  verify_code: string;
  g_recaptcha: string;
  re_password: string;
  user_password: string;
}

export interface IVerifyCode {
  user_email: string;
  verify_code: string;
}

export interface ICreateNewPass {
  verify_code: string;
  g_recaptcha: string;
  re_password: string;
  user_password: string;
}
