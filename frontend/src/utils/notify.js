import { toast } from 'react-toastify';

export default (type, t, path) => toast[type](t(`${path}`), {
  position: 'top-center',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
});
