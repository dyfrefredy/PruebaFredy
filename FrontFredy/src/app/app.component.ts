import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import defaultLanguage from '../assets/i18n/es.json';
import enLanguage from '../assets/i18n/en.json';

@Component({
  // tslint:disable-next-line
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private translate: TranslateService) {
	translate.addLangs(['es','en']);
	this.translate.setTranslation('es', defaultLanguage);
    this.translate.setTranslation('en', enLanguage);
    this.translate.setDefaultLang('en');
  }

	useLanguage(language: string) {
    this.translate.use(language);
  }
  ngOnInit() {
  }
}
