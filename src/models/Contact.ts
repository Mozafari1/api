interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    date_of_birth: Date;
    is_deleted: boolean;
    created_by: number;
    updated_by: number;
    created_at: Date;
    updated_at: Date;
    is_company: boolean;
    company_name: string;
    company_address: string;
    company_phone_number: string;
    company_email: string;
    company_website: string;
    company_logo: string;
    company_description: string;
    renewal_date: Date;

    }

export default Contact;