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

func StorePlacesController(w http.ResponseWriter, r *http.Request) {


	w.Header().Set("Content-Type", jsonapi.MediaType)


	database := services.GetConnection()

	var body validators.StorePlacesDataValidator

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

	places := models.Places{
		Name: body.Data.Attributes.Name,
		Adress: body.Data.Attributes.Adress,
	
	}

	result := database.Create(&places)

	if result.Error != nil {
		responses.UnprocessableEntityResponse(w, result.Error.Error())

		return
	}

	responses.CreatedResponse(w, &places)
}
