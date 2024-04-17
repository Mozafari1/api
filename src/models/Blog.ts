interface Blog {
    id: number;
    title: string;
    description: string;
    sub_description: string;
    sub_sub_description: string;
    created_by: number;
    updated_by: number;
    is_deleted: boolean;
    size: number;
    created_at: Date;
    updated_at: Date;
}

export default Blog;