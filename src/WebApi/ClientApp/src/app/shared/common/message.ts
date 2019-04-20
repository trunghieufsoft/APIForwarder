import { SweetAlertOptions, SweetAlertType } from 'sweetalert2';

export interface Message {
  title?: string;
  text?: string;
  type?: SweetAlertType;
  position?: SweetAlertOptions['position'];
  timer?: number;
  showConfirmButton?: boolean;
  showCloseButton?: boolean;
  toast?: boolean;
  background?: string;
  showCancelButton?: boolean;
  preConfirm?: any;
  onAfterClose?: any;
  html?: string;
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
}
