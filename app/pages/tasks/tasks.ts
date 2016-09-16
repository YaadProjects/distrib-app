import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, App, ItemSliding, List, NavController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
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

  constructor (
    public app: App,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public delivData: DeliveryData,
    public user: UserData
  ) { }

  ngOnInit() {
    this.getCurrentShift();
  }

  refreshShift(refresher) {
    this.getCurrentShift();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  getCurrentShift() {
    this.delivData.getShifts({start: new Date()})
    .subscribe(data => {
      this.currentShift = data[0];
    }, err => {
      this.handleError(err);
    });
  }

  loadMap() {
    this.labelIndex = 0; // reset label index
    let latLng = new google.maps.LatLng(this.currentShift.waypoints[0].location.latitude, this.currentShift.waypoints[0].location.longitude);
    let mapOptions = {
      center: { lat: 53.5438, lng: -113.4956},
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
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

  viewTask(task, i) {
    this.navCtrl.push(TaskPage, task, i);
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