declare module 'laravel-vue-pagination' {
    import { DefineComponent } from 'vue';
    
    const TailwindPagination: DefineComponent<{
        data?: any;
        limit?: number;
        keepLength?: boolean;
        showDisabled?: boolean;
        editable?: boolean;
        align?: string;
        size?: string;
        'small-devices'?: {
            active?: boolean;
            items?: number;
            hideNavigation?: boolean;
        };
        'medium-devices'?: {
            active?: boolean;
            items?: number;
            hideNavigation?: boolean;
        };
    }, any, any>;
    
    export { TailwindPagination };
}
