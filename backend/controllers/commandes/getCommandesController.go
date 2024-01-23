package commandes

import (
	"backend/models"
	"backend/responses"
	"net/http"

	"github.com/google/jsonapi"
)

func GetCommandeController(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	commande := r.Context().Value("commande").(models.Commande)

	responses.OkResponse(w, &commande)
}