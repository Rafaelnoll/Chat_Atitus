import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { FluentProvider, webDarkTheme } from '@fluentui/react-components';
import './index.css'

const root = createRoot(document.getElementById('root')!);

root.render(
  <FluentProvider className='h-100' theme={webDarkTheme}>
    <App />
  </FluentProvider>,
);