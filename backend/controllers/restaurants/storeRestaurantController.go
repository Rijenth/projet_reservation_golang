package restaurants

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

func StoreRestaurantController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	place := r.Context().Value("places").(models.Places)

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
