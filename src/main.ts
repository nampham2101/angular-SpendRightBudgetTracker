import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import {appConfig} from './app/core/app.config';
import {registerLocaleData} from '@angular/common';
import localeVi from '@angular/common/locales/vi';

registerLocaleData(localeVi);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
