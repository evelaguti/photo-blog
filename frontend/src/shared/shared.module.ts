import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TagInputModule} from 'ng2-tag-input';
import {GalleryComponent, GalleryGridComponent} from './components/gallery';
import {PagerServiceProvider} from './services/pager';
import {ScrollerService} from './services/scroller';
import {ApiService, ApiErrorHandler as BaseApiErrorHandler} from './services/api';
import {ApiErrorHandler} from './services/api-error-handler';
import {LockerServiceProvider} from './services/locker';
import {LockProcessServiceProvider} from './services/lock-process';
import {NavigatorServiceProvider} from './services/navigator';
import {TitleService} from './services/title';
import {NotificatorService} from './services/notificator';
import {EnvService} from './services/env';
import {AuthService, AuthProviderService} from './services/auth';
import {LocalStorageService} from './services/local-storage';
import {UserDataProviderService} from './services/user-data-provider';
import {CallbackHandlerService} from './services/callback-handler';
import {FileSelectInputComponent} from './components/file-select-input/file-select-input.component';
import {TagsSelectInputComponent} from './components/tags-select-input/tags-select-input.component';
import {SpinnerComponent} from './components/spinner/spinner.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TagInputModule,
    ],
    declarations: [
        GalleryComponent,
        GalleryGridComponent,
        FileSelectInputComponent,
        TagsSelectInputComponent,
        SpinnerComponent,
    ],
    exports: [
        CommonModule,
        FormsModule,
        GalleryComponent,
        GalleryGridComponent,
        FileSelectInputComponent,
        TagsSelectInputComponent,
        SpinnerComponent,
    ],
    providers: [
        TitleService,
        NotificatorService,
        AuthService,
        AuthProviderService,
        UserDataProviderService,
        ApiService,
        ApiErrorHandler,
        {provide: BaseApiErrorHandler, useClass: ApiErrorHandler},
        LockerServiceProvider,
        LockProcessServiceProvider,
        NavigatorServiceProvider,
        PagerServiceProvider,
        ScrollerService,
        EnvService,
        LocalStorageService,
        CallbackHandlerService,
    ],
})
export class SharedModule {
}
