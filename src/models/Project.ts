interface Project {
    id: number;
    name: string;
    domain_name: string;
    status: string;
    service_type: string;
    is_deleted: boolean;
    created_by: number;
    updated_by: number;
    created_at: Date;
    updated_at: Date;
    contact_id: number;
    }

export default Project;