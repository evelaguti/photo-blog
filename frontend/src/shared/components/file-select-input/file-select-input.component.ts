import {Component, Input, Output, Inject, ElementRef, EventEmitter} from '@angular/core';

@Component({
    selector: 'file-select-input',
    templateUrl: './file-select-input.component.html',
})
export class FileSelectInputComponent {
    @Input() disabled:boolean;
    @Output() onSelect:EventEmitter<File> = new EventEmitter<File>();

    constructor(@Inject(ElementRef) private elementRef:ElementRef) {
    }

    private onChange = () => {
        if (this.isFile()) {
            this.onSelect.emit(this.getFile());
        }
    };

    private getFile = ():File => {
        return this.elementRef.nativeElement.firstElementChild.files[0];
    };

    private isFile = ():boolean => {
        return this.elementRef.nativeElement.firstElementChild.files.length > 0;
    };
}
