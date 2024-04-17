interface Feedback {
    id: number;
    name: string;
    role: string;
    feedback: string;
    contact_id: number;
    created_by: number;
    updated_by: number;
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
    approved_at: Date;
    is_approved: boolean;
    is_waiting: boolean;
    is_sent: boolean;
    url: string;
    is_active: boolean;
}

export default Feedback;