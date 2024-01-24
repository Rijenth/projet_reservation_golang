package menus

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

func UpdateMenusController(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.UpdateMenusDataValidator

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

	menus := r.Context().Value("menus").(models.Menus)

	if body.Data.Attributes.Name != "" {
		menus.Name = body.Data.Attributes.Name
	}

	if body.Data.Attributes.Price != 0 {
		menus.Price = body.Data.Attributes.Price
	}

	result := database.Save(&menus)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.OkResponse(w, &menus)
}