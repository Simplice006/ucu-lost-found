# API attendue par le frontend (backend à compléter)

Publics : GET /api/reports?q&type&category&location&date&status -> { reports: [...] } (sans private_details)
          GET /api/reports/:id -> { report } (private_details seulement pour le propriétaire/admin ;
          `my_claim` = { status, admin_reason } du demandeur connecté)
Étudiant : POST /api/reports | PUT /api/reports/:id (-> { report:{id} }) | GET /api/reports/mine -> { reports }
           POST /api/reports/:id/claims { evidence } | GET /api/claims/mine -> { claims:[{id,report_id,report_title,evidence,status,admin_reason,returned_at,created_at}] }
Admin :    GET /api/admin/claims?status=pending|approved|rejected|all -> { claims:[{..., claimant_name, private_details}] }
           POST /api/admin/claims/:id/approve { reason } | /reject { reason } | /confirm-return
Erreurs : { error, fields:{champ:message} } (déjà le format de auth.js)
