package places


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


func UpdatePlacesController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.UpdatePlacesDataValidator

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

	places := r.Context().Value("places").(models.Places)

	if body.Data.Attributes.Name != "" {
		places.Name = body.Data.Attributes.Name
	}

	result := database.Save(&places)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.OkResponse(w, &places)
}