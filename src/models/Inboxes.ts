interface Inboxes {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    service_type: string;
    message: string;
    is_deleted: boolean;
    created_from_ip: string;
    is_responded: boolean;
    is_customer: boolean;
    created_at: Date;
    updated_at: Date;
}

export default Inboxes;