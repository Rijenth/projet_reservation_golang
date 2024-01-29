package services

import (
	"fmt"
	"reflect"

	"gorm.io/gorm"
)

func Filter(database *gorm.DB, model interface{}, filters map[string]interface{}, preloadRelations []string) interface{} {
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

	return results
}
