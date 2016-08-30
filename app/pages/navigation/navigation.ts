import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
 
declare var google;
 
@Component({
  templateUrl: 'build/pages/navigation/navigation.html'
})
export class NavigationPage {
 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
 
  constructor(public navCtrl: NavController) {
 
  }
 
  ionViewLoaded(){
    this.loadMap();
  }
 
  loadMap(){
 
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
  }
}