import { AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors } from "@angular/forms";
import { catchError, map, Observable, of } from "rxjs";
import { InventoryopService } from "../service/inventory/inventoryop.service";

export class CustomValidator{  

    // static checkPartsAvailablity(control: FormControl, invService:InventoryopService){
    //     debugger;
    //     if(!control.value){
    //         return null
    //     }else{
    //         return invService.checkAvailability(control.value).pipe(
    //             map(isAvailable => (isAvailable ? null : { partUnavailable: true })),
    //             catchError(() => of(null))
    //         );
    //     }
       
    // }
    static checkPartsAvailablity(inventoryService: InventoryopService): AsyncValidatorFn {

        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            debugger;
          if (!control.value) {
            return of(null);
          }else{
            return inventoryService.checkAvailability(control.value).pipe(
                map(isAvailable => (isAvailable ? null : { partUnavailable: true })),
                catchError(() => of(null))
              );
            };
          }
        
      }

}