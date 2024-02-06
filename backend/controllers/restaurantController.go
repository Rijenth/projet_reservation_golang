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
	"gorm.io/gorm/clause"
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

	results := services.Filter(database, &models.Restaurant{}, map[string]interface{}{
		"place_id": place.ID,
		"name":     r.URL.Query().Get("filter['name']"),
	})

	responses.OkResponse(w, results)
}

func (controller *RestaurantController) IndexFromUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	user := r.Context().Value("user").(models.User)

	if user.Role != "owner" {
		responses.UnprocessableEntityResponse(w, []error{fmt.Errorf("Cannot get restaurants for a user that is not an owner")})

		return
	}

	database := services.GetConnection()

	var restaurants []*models.Restaurant

	database.Where("user_id = ?", user.ID).Preload(clause.Associations).Find(&restaurants)

	responses.OkResponse(w, restaurants)
}

func (controller *RestaurantController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	place := r.Context().Value("place").(models.Place)

	database := services.GetConnection()

	var body validators.StoreRestaurantDataValidator

	if err := body.Validate(&r.Body, &w); err != nil {
		return
	}

	var user models.User

	result := database.First(&user, body.Data.Relationships.User.ID)

	if user.Role != "owner" {
		responses.UnprocessableEntityResponse(w, []error{fmt.Errorf("Cannot create a restaurant for a user that is not an owner")})

		return
	}

	existingRestaurant := models.Restaurant{}

	result = database.Where("user_id = ?", user.ID).First(&existingRestaurant)

	if existingRestaurant.ID != 0 {
		responses.UnprocessableEntityResponse(w, []error{fmt.Errorf("A user owner can have only one restaurant!")})

		return
	}

	restaurant := models.Restaurant{}

	restaurant.Fill(map[string]string{
		"name": body.Data.Attributes.Name,
	})

	restaurant.SetPlace(&place)

	restaurant.SetUser(&user)

	result = database.Create(&restaurant)

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
		responses.UnprocessableEntityResponse(w, []error{err})

		return
	}

	validate := validator.New()

	err = validate.Struct(body.Data)

	if err != nil {
		responses.FailedValidationResponse(w, []error{err})

		return
	}

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	restaurant.Fill(map[string]string{
		"name": body.Data.Attributes.Name,
	})

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
