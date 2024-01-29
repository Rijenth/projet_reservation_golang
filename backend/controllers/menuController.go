package controllers

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/google/jsonapi"
)

type MenuController struct {
}

func (controller *MenuController) Get(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	menu := r.Context().Value("menu").(models.Menu)

	database := services.GetConnection()

	database.Model(&menu).Association("Restaurant").Find(&menu.Restaurant)

	responses.OkResponse(w, &menu)
}

func (controller *MenuController) Index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	nameFilter := r.URL.Query().Get("filter['name']")
	priceFilter := r.URL.Query().Get("filter['price']")

	preloadRelations := []string{"Restaurant", "Command"}

	database := services.GetConnection()

	results := services.Filter(database, &models.Menu{}, map[string]interface{}{
		"restaurant_id": restaurant.ID,
		"name":          nameFilter,
		"price":         priceFilter,
	}, preloadRelations)

	responses.OkResponse(w, results)
}

func (controller *MenuController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	var body validators.StoreMenusDataValidator

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

	menu := models.Menu{
		Name:       body.Data.Attributes.Name,
		Price:      body.Data.Attributes.Price,
		Restaurant: &restaurant,
		//MenuItems: []models.MenuItem{
	}

	result := database.Create(&menu)

	fmt.Println("result", result)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.CreatedResponse(w, &menu)
}

func (controller *MenuController) Update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.UpdateMenusDataValidator

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

	menu := r.Context().Value("menu").(models.Menu)

	if body.Data.Attributes.Name != "" {
		menu.Name = body.Data.Attributes.Name
	}

	if body.Data.Attributes.Price != 0 {
		menu.Price = body.Data.Attributes.Price
	}

	result := database.Save(&menu)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.OkResponse(w, &menu)
}

func (controller *MenuController) Delete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	menu := r.Context().Value("menu").(models.Menu)

	database := services.GetConnection()

	database.Delete(&menu)

	w.WriteHeader(http.StatusNoContent)
}
