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

type PlaceController struct {
}

func (controller *PlaceController) Get(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	place := r.Context().Value("place").(models.Place)

	responses.OkResponse(w, &place)
}

func (controller *PlaceController) Index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	user := r.Context().Value("user").(models.User)

	preloadRelations := []string{"User", "Restaurants"}

	database := services.GetConnection()

	results := services.Filter(database, &models.Place{}, map[string]interface{}{
		"user_id": user.ID,
		"name":    r.URL.Query().Get("filter['name']"),
		"adress":  r.URL.Query().Get("filter['adress']"),
	}, preloadRelations)

	responses.OkResponse(w, results)
}

func (controller *PlaceController) Store(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	user := r.Context().Value("user").(models.User)

	if user.Role != "admin" {
		responses.UnauthorizedResponse(w, "Only admin can create place")

		return
	}

	database := services.GetConnection()

	var body validators.StorePlaceDataValidator

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

	place := models.Place{}

	place.Fill(map[string]string{
		"name":   body.Data.Attributes.Name,
		"adress": body.Data.Attributes.Adress,
	})

	place.SetUser(&user)

	result := database.Create(&place)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.CreatedResponse(w, &place)
}
