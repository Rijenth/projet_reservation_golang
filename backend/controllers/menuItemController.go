package controllers

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"backend/validators"
	"encoding/json"
	"net/http"
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/google/jsonapi"
)

type MenuItemController struct {
}

func (controller *MenuItemController) Get(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	menuItem := r.Context().Value("menuItem").(models.MenuItem)

	database := services.GetConnection()

	responses.OkResponse(w, &menuItem)
}

func (controller *MenuItemController) Index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	menu := r.Context().Value("menu").(models.Menu)

	nameFilter := r.URL.Query().Get("filter['name']")
	priceFilter := r.URL.Query().Get("filter['price']")

	preloadRelations := []string{"Menu"}

	database := services.GetConnection()

	results := services.Filter(database, &models.MenuItem{}, map[string]interface{}{
		"menu_id": menu.ID,
		"name":    nameFilter,
		"price":   priceFilter,
	}, preloadRelations)

	responses.OkResponse(w, results)
}

func (controller *MenuItemController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	menu := r.Context().Value("menu").(models.Menu)
	database := services.GetConnection()

	var body validators.StoreMenuItemDataValidator

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		responses.UnprocessableEntityResponse(w, []error{err})
		return
	}

	validate := validator.New()

	err = validate.Struct(body.Data)

	if err != nil {
		responses.FailedValidationResponse(w, []error{err})
		return
	}

	menuItem := models.MenuItem{	
		Name:  body.Data.Attributes.Name,
		Type:  body.Data.Attributes.Type,
		Price: body.Data.Attributes.Price,
	}
	result := database.Create(&menuItem)

	fmt.Println("result", result)

	if result.Error != nil {

		responses.UnprocessableEntityResponse(w, []error{result.Error})


		return
	}

	responses.CreatedResponse(w, &menuItem)
		

}



func (controller *MenuItemController) Update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.UpdateMenuItemDataValidator

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		responses.UnprocessableEntityResponse(w, []error{err})
		return
	}

	menuItem := r.Context().Value("menuItem").(models.MenuItem)

	if body.Data.Attributes.Name != "" {
		menuItem.Name = body.Data.Attributes.Name
	}

	if body.Data.Attributes.Type != "" {
		menuItem.Type = body.Data.Attributes.Type
	}

	if body.Data.Attributes.Price != 0 {
		menuItem.Price = body.Data.Attributes.Price
	}

	result := database.Save(&menuItem)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())
		return
	}

	responses.OkResponse(w, &menuItem)
}


func (controller *MenuItemController) Delete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	menuItem := r.Context().Value("menuItem").(models.MenuItem)
	database := services.GetConnection()

	database.Delete(&menuItem)
	
	w.WriteHeader(http.StatusNoContent)

}
