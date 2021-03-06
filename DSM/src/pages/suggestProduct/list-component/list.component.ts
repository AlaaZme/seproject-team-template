import { Component, Input, EventEmitter } from "@angular/core"
import { Product } from "../product.model";
import { NavController, ModalController, AlertController } from "ionic-angular";
import { ListDetailsComponent } from "./list-details-component/list.details.component";
import { ListService } from "../list.service";
import { ModalcommentPage } from "./modalcomment/modalcomment";
@Component({
    selector:"app-list",
    templateUrl:"./list.component.html"
})
export class listComponent{
  likedelay:boolean=false;
    role:String=localStorage.getItem("authType").replace(/[@.,\/#!$%\^&\*" ;:{}=\_`~()]/g,"");;
    @Input() productDetail:Product;
   commentsChanged= new EventEmitter<number>();

    Liked:Boolean=false;
    constructor(public modalCtrl:ModalController,private navCtrl:NavController,private listService:ListService,public alertCtrl: AlertController){}
    productDetails(){
        this.navCtrl.push(ListDetailsComponent,{
            name:this.productDetail.name,
            description:this.productDetail.description,
            id:this.productDetail._id,
            imageUrl:this.productDetail.imageUrl
        });
    }
 AuthSup(){

    if(this.role==="S" || this.role==="A"  )
     return true;
     else 
return false;
}
    onLike(){
       if(this.likedelay===false){
         this.likedelay=true;
       if (this.productDetail.liked ==true)
       {
        this.listService.DisLikeProduct(this.productDetail);
       }
       else{
        this.listService.likeProduct(this.productDetail);
    }
    this.productDetail.liked=!this.productDetail.liked;
    setTimeout(()=>{
          this.likedelay=false;
    },500)
       }
}
openCommentBox(){
  let modal = this.modalCtrl.create(ModalcommentPage,{id:this.productDetail._id});
  modal.present();
  modal.onDidDismiss(data => {
       this.productDetail.commentsNumber=data;
});

}
deleteItem(){
    this.listService.deleteProduct(this.productDetail._id);

}
Approve(){
    let prompt = this.alertCtrl.create({
      title: 'Amount',
      message: "Enter Amount Of Likes",
      inputs: [
        {
          name: 'Amount',
          placeholder: 'Amount',
          type:"number"
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
           data.amount
          }
        }
      ]
    });
    prompt.present();
  }
  setStatus(){
       let prompt = this.alertCtrl.create({
      title: 'סטטוס',
     cssClass:"status",
      inputs: [
        {
          name: 'Status',
          label:"הוזמן",
          value:"הוזמן",
          type:"radio",
           id:"test1"
        },
         {
          name: 'Status',
          label:"בדרך",
          value:"בדרך",
          type:"radio",
          id:"test2"
        },
         {
          name: 'Status',
          label:"הגיע",
          value:"הגיע",
          type:"radio"
          ,id:"test3"
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
           if(data===undefined){

           }
           else{
             this.productDetail.status=data;
            this.listService.setStatus(this.productDetail._id,data);
           }
          }
        }
      ]
    });
    prompt.present();
  }

}