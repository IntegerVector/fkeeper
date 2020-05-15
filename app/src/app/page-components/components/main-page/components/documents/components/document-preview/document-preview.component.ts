import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as _ from 'lodash';

import { DataSourceService } from 'src/app/shared/services/data-source/data-source.service';
import { Documents } from 'src/app/shared/types/dto/documents-dto';
import { UsersDocuments } from 'src/app/shared/types/dto/users-documents-dto';
import { DocumentTypesEnum } from 'src/app/shared/types/enums/document-types.enum';
import { PermissionsEnum } from 'src/app/shared/types/enums/permissions.enum';
import { NotificationsService } from 'src/app/page-components/components/notification/services/notifications.service';
import { NotificationType } from 'src/app/page-components/components/notification/types/notification-type.enum';

@Component({
    selector: 'app-document-preview',
    templateUrl: './document-preview.component.html',
    styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent implements OnChanges {
    @Input() userDocument: UsersDocuments;
    @Input() permissions: PermissionsEnum[];

    public permited = {
        toViewDocument: false,
        toUploadDocument: false,
        toDeleteDocument: false
    };
    public document: Documents;
    public documentType: DocumentTypesEnum = null;

    constructor(
        private dataSourceService: DataSourceService,
        private notificationsService: NotificationsService,
        private domSanitizer: DomSanitizer
    ) {}

    public ngOnChanges(): void {
        if (_.get(this, 'userDocument.documentId')) {
            this.dataSourceService
                .getDocumentById(this.userDocument.documentId.toString())
                .subscribe(doc => {
                    this.document = doc;

                    this.dataSourceService
                        .getDocumentTypeById(doc.documentType.toString())
                        .subscribe(type => {
                            this.documentType = type;
                        });
            });
        }

        this.updatePermissions(this.permissions);
    }

    public downloadFile(filePath: string): void {
        const element = document.createElement('a');
        element.setAttribute('href', filePath);
        element.setAttribute('download', filePath);

        element.click();
    }

    public deleteFile(fileId: string): void {
        this.dataSourceService.deleteDocument(fileId).subscribe(result => {
            this.notificationsService.push(
                result ? 'Success' : 'Error occures',
                result ? NotificationType.Success : NotificationType.Error
            );
        });
    }

    public isDocumentPDF(): boolean {
        if (this.documentType) {
            return DocumentTypesEnum.PDF === this.documentType;
        }

        return false;
    }

    public getFileSrc(src: string): SafeUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(src);
    }

    private updatePermissions(permissions: PermissionsEnum[]): void {
        const isViewAlloved = !!_.find(permissions, perm => {
            return perm === PermissionsEnum.ReadDocs;
        });

        const isUploadAlloved = !!_.find(permissions, perm => {
            return perm === PermissionsEnum.UploadDocs;
        });

        const isDeleteAlloved = !!_.find(permissions, perm => {
            return perm === PermissionsEnum.DeleteDocs;
        });

        this.permited.toViewDocument = isViewAlloved;
        this.permited.toUploadDocument = isUploadAlloved;
        this.permited.toDeleteDocument = isDeleteAlloved;
    }
}