import {Component, Inject, ViewChildren, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TitleService} from '../../../shared/services/title';
import {ScrollerService} from '../../../shared/services/scroller';
import {LockProcessService, LockProcessServiceProvider} from '../../../shared/services/lock-process';
import {NavigatorService, NavigatorServiceProvider} from '../../../shared/services/navigator';
import {PagerService, PagerServiceProvider} from '../../../shared/services/pager';
import {AuthProviderService} from '../../../shared/services/auth';
import {PhotoDataProviderService} from '../../services/photo-data-provider';
import {Photo} from '../../../shared/models';

@Component({
    selector: 'photos',
    template: require('./photos-by-search-query.component.html'),
})
export class PhotosBySearchQueryComponent {
    @ViewChildren('inputSearch') inputSearchComponent:any;

    private loaded:boolean;
    private queryParams:Object = {query: ''};
    private pager:PagerService;
    private lockProcess:LockProcessService;
    private navigator:NavigatorService;

    constructor(@Inject(ActivatedRoute) private route:ActivatedRoute,
                @Inject(TitleService) private title:TitleService,
                @Inject(ScrollerService) private scroller:ScrollerService,
                @Inject(AuthProviderService) private authProvider:AuthProviderService,
                @Inject(PhotoDataProviderService) private photoDataProvider:PhotoDataProviderService,
                @Inject(NavigatorServiceProvider) navigatorProvider:NavigatorServiceProvider,
                @Inject(PagerServiceProvider) pagerProvider:PagerServiceProvider,
                @Inject(LockProcessServiceProvider) lockProcessProvider:LockProcessServiceProvider) {
        this.navigator = navigatorProvider.getInstance();
        this.pager = pagerProvider.getInstance();
        this.lockProcess = lockProcessProvider.getInstance();
    }

    ngOnInit() {
        this.scroller.scrollToTop();

        this.title.setTitle(['Search Photos']);

        this.route.queryParams
            .map((queryParams) => queryParams['page'])
            .subscribe((page:number) => this.pager.setPage(page));

        this.route.queryParams
            .map((queryParams) => queryParams['show'])
            .subscribe((show:number) => this.queryParams['show'] = show);

        this.route.queryParams
            .map((queryParams) => queryParams['query'])
            .subscribe((query:string) => {
                if (!query) {
                    return;
                }
                this.queryParams['query'] = query;
                this.title.setTitle(['Photos', this.queryParams['query']]);
                this.pager.reset();
                this.loadPhotos(this.pager.calculateLimitForPage(this.pager.getPage()),
                    this.pager.getOffset(), this.queryParams['query']);
            });
    }

    ngAfterViewInit() {
        this.inputSearchComponent.first.nativeElement.focus();
    }

    private processLoadPhotos = (take:number, skip:number, query:string):Promise<Array<Photo>> => {
        return this.photoDataProvider
            .getBySearchQuery(take, skip, query)
            .then((photos:Array<Photo>) => this.pager.appendItems(photos));
    };

    private loadPhotos = (take:number, skip:number, query:string):Promise<Array<Photo>> => {
        return this.lockProcess
            .process(this.processLoadPhotos, [take, skip, query])
            .then((result:any) => {
                this.navigator.setQueryParam('page', this.pager.getPage());
                return result;
            });
    };

    getLoadedPhotos = ():Array<Photo> => {
        return this.pager.getItems();
    };

    loadMorePhotos = ():Promise<Array<Photo>> => {
        return this.loadPhotos(this.pager.getLimit(), this.pager.getOffset(), this.queryParams['query']);
    };

    searchPhotos = () => {
        if (this.queryParams['query'].length) {
            this.navigator.navigate(['photos/search'], {queryParams: {query: this.queryParams['query']}});
        }
    };

    isEmpty = ():boolean => {
        return !this.pager.getItems().length && !this.lockProcess.isProcessing() && !this.loaded;
    };

    isLoading = ():boolean => {
        return this.lockProcess.isProcessing();
    };

    onShowPhoto = (photo:Photo):void => {
        this.navigator.setQueryParam('show', photo.id);
    };

    onHidePhoto = (photo:Photo):void => {
        this.navigator.unsetQueryParam('show');
    };

    onEditPhoto = (photo:Photo):void => {
        this.navigator.navigate(['photo/edit', photo.id]);
    };
}
