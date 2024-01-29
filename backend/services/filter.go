package services

import (
	"backend/responses"
	"fmt"
	"net/http"
	"reflect"

	"github.com/google/jsonapi"
	"gorm.io/gorm"
)

func Filter(w http.ResponseWriter, database *gorm.DB, model interface{}, filters map[string]interface{}, preloadRelations []string) {
	w.Header().Set("Content-Type", jsonapi.MediaType)

	results := reflect.New(reflect.SliceOf(reflect.TypeOf(model))).Elem().Interface()

	query := database

	for key, value := range filters {
		if value != "" {
			query = query.Where(fmt.Sprintf("%s = ?", key), value)
		}
	}

	for _, relation := range preloadRelations {
		query = query.Preload(relation)
	}

	query.Find(&results)

	responses.OkResponse(w, results)
}
