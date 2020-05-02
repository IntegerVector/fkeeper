import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ErrorModule } from '../error/error.module';
import { NavigationPanelComponent } from './components/navigation-panel/navigation-panel.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { UserPageComponent } from './components/user-authorization/user-page.component';
import { SharedModule } from '../shared/shared.module';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationsService } from './components/notification/services/notifications.service';

@NgModule({
    declarations: [
        NavigationPanelComponent,
        MainPageComponent,
        UserPageComponent,
        NotificationComponent
    ],
    exports: [
        NavigationPanelComponent,
        NotificationComponent
    ],
    imports: [
        FormsModule,
        BrowserModule,
        RouterModule,
        SharedModule,
        ErrorModule
    ],
    providers: [
        NotificationsService
    ],
})
export class PageComponentsModule { }
