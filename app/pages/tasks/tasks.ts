import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, App, ItemSliding, List, NavController, LoadingController } from 'ionic-angular';
import { DeliveryData } from '../../providers/delivery-data';
import { TaskPage } from '../../pages/task/task';

declare var google;

@Component({
  templateUrl: 'build/pages/tasks/tasks.html',
})
export class TasksPage {

  @ViewChild('map') mapElement: ElementRef;
  currentShift: any = {};
  currentTask: any = {};
  map: any;

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  segment = 'list'; // or map
  labelIndex = 0;
  mapLoaded = false;

  constructor (
    public app: App,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public delivData: DeliveryData
  ) { }

  ngOnInit() {
    this.getCurrentShift();
  }

  ngAfterViewChecked(){
    if (this.segment === 'map' && this.mapLoaded === false) {
      this.loadMap();
      this.mapLoaded = true;
    }
  }

  getCurrentShift(refresher?) {
    this.delivData.getCurrentShift().then(shift => {
      let filters = {id: shift};
      this.delivData.getShifts(filters)
        .subscribe(data => {
          this.currentShift = data;
        }, err => {
          this.handleError(err);
        }, () => {
          if (refresher) {
            refresher.complete();
          };
        });
    });
  }

  viewTask(task, i) {
    this.navCtrl.push(TaskPage, task, i);
  }

  loadMap() {
    this.labelIndex = 0; // reset label index
    //  let latLng = new google.maps.LatLng(this.currentShift.waypoints[0].location.latitude, this.currentShift.waypoints[0].location.longitude);
    let mapOptions = {
      center: { lat: 53.5438, lng: -113.4956},
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    if (this.currentShift) {
      this.addWaypoints();
    }
  }

  addWaypoints() {
    for (var i = 0; i < this.currentShift.waypoints.length; i++) {
      let waypoint = this.currentShift.waypoints[i];
      this.addMarker({ lat: waypoint.location.latitude, lng: waypoint.location.longitude })
    }
  }

  addMarker(location) {
    var marker = new google.maps.Marker({
      position: location,
      label: this.alphabet[this.labelIndex++],
      map: this.map
    });
  }

  getMinutes(seconds) {
    return Math.round(seconds/60);
  }

  handleError(err) {
    let alert = this.alertCtrl.create({
      title: 'Problem with server',
      subTitle: err,
      buttons: ['OK']
    });
    alert.present();
  }

}