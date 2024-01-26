package controllers

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"backend/validators"
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/google/jsonapi"
)

type RestaurantController struct {
}

func (controller *RestaurantController) Get(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	responses.OkResponse(w, &restaurant)
}

func (controller *RestaurantController) Index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	place := r.Context().Value("place").(models.Place)

	database := services.GetConnection()

	var restaurants []*models.Restaurant

	database.Where("place_id = ?", place.ID).Preload("Place").Find(&restaurants)

	responses.OkResponse(w, restaurants)
}

func (controller *RestaurantController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	place := r.Context().Value("place").(models.Place)

	database := services.GetConnection()

	var body validators.StoreRestaurantDataValidator

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		responses.UnprocessableEntityResponse(w, err.Error())

		return
	}

	validate := validator.New()

	err = validate.Struct(body.Data)

	if err != nil {
		responses.FailedValidationResponse(w, err)

		return
	}

	restaurant := models.Restaurant{
		Name:    body.Data.Attributes.Name,
		PlaceID: place.ID,
		Place:   &place,
		// Menus:  	body.Data.Attributes.Menus,
		// Commands:  	body.Data.Attributes.Commands,
	}

	result := database.Create(&restaurant)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.CreatedResponse(w, &restaurant)
}

func (controller *RestaurantController) Update(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.UpdateRestaurantDataValidator

	err := json.NewDecoder(r.Body).Decode(&body)

	if err != nil {
		responses.UnprocessableEntityResponse(w, err.Error())

		return
	}

	validate := validator.New()

	err = validate.Struct(body.Data)

	if err != nil {
		responses.FailedValidationResponse(w, err)

		return
	}

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	if body.Data.Attributes.Name != "" {
		restaurant.Name = body.Data.Attributes.Name
	}

	result := database.Save(&restaurant)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.OkResponse(w, &restaurant)
}

func (controller *RestaurantController) Delete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	database.Delete(&restaurant)

	w.WriteHeader(http.StatusNoContent)
}
