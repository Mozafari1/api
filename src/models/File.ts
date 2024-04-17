interface File {
    id: number;
    name: string;
    file_name: string;
    size: number;
    type: string;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
    created_by: number;
    updated_by: number;
    contact_id: number;
    project_id: number;
    service_id: number;
    blog_id: number;
    price_id: number;
    user_id: number;
    connection_type_id: number;
    special_type: string;
    is_invoice: boolean;
    is_invoice_paid: boolean;
    is_invoice_sent: boolean;
    is_report: boolean;
    is_report_sent: boolean;
    is_contract: boolean;
    is_contract_signed: boolean;
    is_contract_sent: boolean;
    is_offer: boolean;
    is_offer_sent: boolean;
    is_offer_accepted: boolean;
    is_offer_declined: boolean;


    }

export default File;