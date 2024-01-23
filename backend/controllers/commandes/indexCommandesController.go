package commandes

import (
	"backend/models"
	"backend/responses"
	"backend/services"
	"net/http"

	"github.com/google/jsonapi"
)

func IndexCommandesController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	restaurant := r.Context().Value("restaurant").(models.Restaurant)

	database := services.GetConnection()

	var commandes []*models.Commande

	database.Where("restaurant_id = ?", restaurant.ID).Preload("Restaurant").Find(&commandes)

	responses.OkResponse(w, commandes)
}