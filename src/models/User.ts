interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  active: boolean;
  is_deleted: boolean;
  activation_token?: string;
  activation_token_expires?: Date;
  failed_login_attempts: number;
  phone_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  date_of_birth?: Date;
  gender?: string;
  role?: string;
  language_preferences?: string;
  code?: string;
  last_seen?: Date;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
  ip_address?: string;
  requested_password_reset?: boolean;
  password_reset_token?: string;
  password_reset_token_expires?: Date;

}

export default User;
