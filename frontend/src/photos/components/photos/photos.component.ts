import {Component, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
    TitleService,
    AuthProviderService,
    NavigatorServiceProvider,
    NavigatorService,
    PagerServiceProvider,
    PagerService,
    LockProcessServiceProvider,
    LockProcessService,
} from '../../../shared/services';
import {PhotoDataProviderService} from '../../services';
import {PhotoToGalleryImageMapper} from '../../mappers';
import {GalleryImage} from '../../../shared/components/gallery';

@Component({
    selector: 'photos',
    templateUrl: 'photos.component.html',
})
export class PhotosComponent {
    private defaults:any = {page: 1, perPage: 20};
    private queryParams:Object = {};
    private pager:PagerService;
    private navigator:NavigatorService;
    private lockProcess:LockProcessService;
    private galleryImages:Array<GalleryImage> = [];
    private hasMoreGalleryImages:boolean = true;

    constructor(@Inject(ActivatedRoute) private route:ActivatedRoute,
                @Inject(TitleService) private title:TitleService,
                @Inject(AuthProviderService) private authProvider:AuthProviderService,
                @Inject(PhotoDataProviderService) private photoDataProvider:PhotoDataProviderService,
                @Inject(NavigatorServiceProvider) navigatorProvider:NavigatorServiceProvider,
                @Inject(PagerServiceProvider) pagerProvider:PagerServiceProvider,
                @Inject(LockProcessServiceProvider) lockProcessProvider:LockProcessServiceProvider) {
        this.pager = pagerProvider.getInstance(this.defaults.page, this.defaults.perPage);
        this.navigator = navigatorProvider.getInstance();
        this.lockProcess = lockProcessProvider.getInstance();
    }

    ngOnInit() {
        this.title.setTitle('All Photos');
        window.scrollTo(0, 0);

        this.route.queryParams
            .map((queryParams) => queryParams['page'])
            .subscribe((page:number) => this.queryParams['page'] = page ? Number(page) : this.defaults.page);

        this.route.queryParams
            .map((queryParams) => queryParams['show'])
            .subscribe((show:number) => this.queryParams['show'] = Number(show));
    }

    ngAfterViewInit() {
        const perPageOffset = this.queryParams['page'] * this.pager.getPerPage();
        this.loadPhotos(this.defaults.page, perPageOffset);
    }

    private loadPhotos = (page:number, perPage:number):Promise<Array<GalleryImage>> => {
        return this.lockProcess
            .process(this.photoDataProvider.getAll, [page, perPage])
            .then(this.handleLoadPhotos);
    };

    private handleLoadPhotos = (response:any):Array<GalleryImage> => {
        const galleryImages = PhotoToGalleryImageMapper.map(response.data);
        this.hasMoreGalleryImages = Boolean(response.data.length);
        if (response.data.length) {
            this.pager.setPage(response.current_page);
            this.navigator.setQueryParam('page', this.pager.getPage());
            this.galleryImages = this.galleryImages.concat(galleryImages);
        }
        return galleryImages;
    };

    loadMorePhotos = ():Promise<Array<GalleryImage>> => {
        return this.loadPhotos(this.pager.getNextPage(), this.pager.getPerPage());
    };

    isEmpty = ():boolean => {
        return !this.galleryImages.length && !this.lockProcess.isProcessing();
    };

    isLoading = ():boolean => {
        return this.lockProcess.isProcessing();
    };

    onShowPhoto = (galleryImage:GalleryImage):void => {
        this.navigator.setQueryParam('show', galleryImage.getId());
    };

    onHidePhoto = (galleryImage:GalleryImage):void => {
        this.navigator.unsetQueryParam('show');
    };

    onEditPhoto = (galleryImage:GalleryImage):void => {
        this.navigator.navigate(['photo/edit', galleryImage.getId()]);
    };
}
