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
	"github.com/google/uuid"
)

func StoreCommandeController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	var body validators.StoreCommandeDataValidator

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

	// TODO: generate identification number for the commande
	identificationNumber, err := uuid.NewRandom()
	if err != nil {
		responses.InternalServerErrorResponse(w, err.Error())
		return
	}

	// TODO: set the date of the commande to the current date
	// setDate()

	// TODO: calculate the total price of the commande
	// calculateTotalPrice()

	commande := models.Commande{
		IdentificationNumber: identificationNumber.String(),
		Date: 			   "2021-01-01",
		Description:       body.Data.Attributes.Description,
		Status:            body.Data.Attributes.Status,
		Amount:            0,
		Restaurant: &restaurant,
	}

	result := database.Create(&commande)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.CreatedResponse(w, &commande)
}