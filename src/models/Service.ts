interface Service {
    id: number;
    title: string;
    less_content: string;
    main_content: string;
    sub_title: string;
    sub_content: string;
    sub_points_title:string;
    sub_point_titleA:string;
    sub_point_contentA:string;
    sub_point_titleB:string;
    sub_point_contentB:string;
    sub_point_titleC:string;
    sub_point_contentC:string;
    sub_point_titleD:string;
    sub_point_contentD:string;
    sub_point_titleE:string;
    sub_point_contentE:string;
    summary_title:string;
    summary_main_content:string;
    summary_sub_content:string;
    summary_sub_sub_content:string;
    is_deleted: boolean;
    created_by: number;
    updated_by: number;
    created_at: Date;
    updated_at: Date;

    }

export default Service;