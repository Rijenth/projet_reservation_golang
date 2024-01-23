package commandes

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

func UpdateCommandeController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	database := services.GetConnection()

	var body validators.UpdateCommandeDataValidator

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

	commande := r.Context().Value("commande").(models.Commande)

	// TODO: calculate the total price of the commande if amount is changed then update the amount

	if body.Data.Attributes.Description != "" {
		commande.Description = body.Data.Attributes.Description
	} else if body.Data.Attributes.Status != "" {
		commande.Status = body.Data.Attributes.Status
	}

	// TODO: see if we change an other field


	result := database.Save(&commande)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.OkResponse(w, &commande)
}