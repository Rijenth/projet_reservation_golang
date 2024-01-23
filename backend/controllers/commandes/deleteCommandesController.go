package commandes

import (
	"backend/models"
	"backend/services"
	"net/http"

	"github.com/google/jsonapi"
)

func DeleteCommandeController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	commande := r.Context().Value("commande").(models.Commande)

	database := services.GetConnection()

	database.Delete(&commande)

	w.WriteHeader(http.StatusNoContent)
}