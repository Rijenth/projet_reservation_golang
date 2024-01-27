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
	"github.com/google/uuid"
)

type CommandController struct {
}

func (controller *CommandController) Get(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	commande := r.Context().Value("commande").(models.Commande)

	responses.OkResponse(w, &commande)
}

func (controller *CommandController) Index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	var commandes []*models.Commande

	database.Where("restaurant_id = ?", restaurant.ID).Preload("Restaurant").Find(&commandes)

	responses.OkResponse(w, commandes)
}

func (controller *CommandController) Store(w http.ResponseWriter, r *http.Request) {
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

	// TODO: calculate the total price of the commande
	// calculateTotalPrice()

	commande := models.Commande{
		IdentificationNumber: identificationNumber.String(),
		Description:          body.Data.Attributes.Description,
		Status:               body.Data.Attributes.Status,
		Amount:               0,
		Restaurant:           &restaurant,
	}

	result := database.Create(&commande)

	if result.Error != nil {
		responses.InternalServerErrorResponse(w, result.Error.Error())

		return
	}

	responses.CreatedResponse(w, &commande)
}

func (controller *CommandController) Update(w http.ResponseWriter, r *http.Request) {
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

	//TODO: update the date of the commande if the date is changed

	if body.Data.Attributes.Description != "" {
		commande.Description = body.Data.Attributes.Description
	}

	if body.Data.Attributes.Status != "" {
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

func (controller *CommandController) Delete(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	commande := r.Context().Value("commande").(models.Commande)

	database := services.GetConnection()

	database.Delete(&commande)

	w.WriteHeader(http.StatusNoContent)
}
