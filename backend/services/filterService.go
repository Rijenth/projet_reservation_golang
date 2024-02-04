package services

import (
	"fmt"
	"reflect"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func Filter(database *gorm.DB, model interface{}, filters map[string]interface{}) interface{} {
	results := reflect.New(reflect.SliceOf(reflect.TypeOf(model))).Elem().Interface()

	query := database

	for key, value := range filters {
		if value != "" {
			query = query.Where(fmt.Sprintf("%s = ?", key), value)
		}
	}

	query = query.Preload(clause.Associations)

	query.Find(&results)

	return results
}
