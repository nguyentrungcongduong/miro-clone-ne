declare module 'laravel-vue-pagination' {
  import { DefineComponent } from 'vue';
  const LaravelVuePagination: DefineComponent<{
    data: {
      type: Object;
      default: () => Record<string, any>;
    };
    showDisabled: {
      type: Boolean;
      default: boolean;
    };
    limit: {
      type: Number;
      default: number;
    };
    keepLength: {
      type: Boolean;
      default: boolean;
    };
    size: {
      type: String;
      default: string;
    };
    align: {
      type: String;
      default: string;
    };
    onEachSide: {
      type: Number;
      default: number;
    };
  }>;
  export default LaravelVuePagination;
}
