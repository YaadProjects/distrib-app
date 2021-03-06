import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { AuthPage } from '../pages/auth/auth';
import { TabsPage } from '../pages/tabs/tabs';

import { AuthService } from '../providers/auth';
import { DeliveryData } from '../providers/delivery-data';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {

	@ViewChild(Nav) nav: Nav;

  rootPage = AuthPage;

  constructor (
    public events: Events,
    public platform: Platform,
    public delivData: DeliveryData,
    public auth: AuthService
  ) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
    });
    this.listenToLoginEvents();
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.nav.setRoot(TabsPage);
    });
    this.events.subscribe('user:signup', () => {
    });
    this.events.subscribe('user:logout', () => {
      this.nav.setRoot(AuthPage);
    });
  }

}