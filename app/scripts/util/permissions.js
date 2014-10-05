'use strict';

angular.module('bsis')

  // Donor Permissions
  .constant('APIHOST', 'localhost')
  .constant('ADD_DONOR', 'Add Donor')
  .constant('VIEW_DONOR', 'View Donor')
  .constant('EDIT_DONOR', 'Edit Donor')
  .constant('VOID_DONOR', 'Void Donor')
  .constant('ADD_DEFERRAL', 'Add Deferral')
  .constant('VIEW_DEFERRAL', 'View Deferral')
  .constant('EDIT_DEFERRAL', 'Edit Deferral')
  .constant('VOID_DEFERRAL', 'Void Deferral')
  .constant('ADD_DONOR_CODE', 'Add Donor Code')
  .constant('VIEW_DONOR_CODE', 'View Donor Code')
  .constant('EDIT_DONOR_CODE', 'Edit Donor Code')
  .constant('VOID_DONOR_CODE', 'Void Donor Code')
  .constant('VIEW_DONOR_CODE_GROUP', 'View Donor Code Group')

  // Donation Permissions
  .constant('ADD_DONATION', 'Add Donation')
  .constant('VIEW_DONATION', 'View Donation')
  .constant('EDIT_DONATION', 'Edit Donation')
  .constant('VOID_DONATION', 'Void Donation')

  //Donation Batch Permissions
  .constant('ADD_DONATION_BATCH', 'Add Donation Batch')
  .constant('VIEW_DONATION_BATCH', 'View Donation Batch')
  .constant('EDIT_DONATION_BATCH', 'Edit Donation Batch')
  .constant('VOID_DONATION_BATCH', 'Void Donation Batch')

  // Mobile Clinic Permissions
  .constant('IMPORT_CLINIC_DATA', 'Import Clinic Data')
  .constant('EXPORT_CLINIC_DATA', 'Export Clinic Data')

  // Component Permissions
  .constant('ADD_COMPONENT', 'Add Component')
  .constant('VIEW_COMPONENT', 'View Component')
  .constant('EDIT_COMPONENT', 'Edit Component')
  .constant('VOID_COMPONENT', 'Void Component')

  //Request Permissions
  .constant('ADD_REQUEST', 'Add Request')
  .constant('EDIT_REQUEST', 'Edit Request')
  .constant('VIEW_REQUEST', 'View Request')
  .constant('VOID_REQUEST', 'Void Request')

  //Test Results Permissions
  .constant('ADD_TEST_OUTCOME', 'Add Test Outcome')
  .constant('EDIT_TEST_OUTCOME', 'Edit Test Outcome')
  .constant('VIEW_TEST_OUTCOME', 'View Test Outcome')
  .constant('VOID_TEST_OUTCOME', 'Void Test Outcome')

  // TTI Testing permissions
  .constant('ADD_TTI_OUTCOME', 'Add TTI Outcome')
  .constant('EDIT_TTI_OUTCOME', 'Edit TTI Outcome')
  .constant('VIEW_TTI_OUTCOME', 'View TTI Outcome')

  // Blood Typing Permissions
  .constant('EDIT_BLOOD_TYPING_OUTCOMES', 'Edit Blood Typing Outcome')
  .constant('ADD_BLOOD_TYPING_OUTCOME', 'Add Blood Typing Outcome')
  .constant('VIEW_BLOOD_TYPING_OUTCOME', 'View Blood Typing Outcome')

  // Blood Bank Staff Permissions
  .constant('BLOOD_CROSS_MATCH_CHECK', 'Blood Cross Match Check')
  .constant('ISSUE_COMPONENT', 'Issue Component')

  // Inventory Permissions
  .constant('COMPONENT_LABELLING', 'Component Labelling')

  // Discard Permissions
  .constant('DISCARD_COMPONENT', 'Discard Component')
  .constant('VIEW_DISCARDS', 'View Discards')

  // Reporting Permissions
  .constant('DONATIONS_REPORTING', 'Reporting - Donations')
  .constant('REQUESTS_REPORTING', 'Reporting - Requests')
  .constant('TTI_REPORTING', 'Reporting - TTI Testing')
  .constant('COMPONENTS_ISSUED_REPORTING', 'Reporting - Components')
  .constant('COMPONENTS_DISCARDED_REPORTING', 'Reporting - Discards')

  // Admin and Super-User Permissions
  .constant('MANAGE_USERS', 'Manage Users')
  .constant('MANAGE_ROLES', 'Manage Roles')
  .constant('MANAGE_DONATION_SITES', 'Manage Donation Sites')
  .constant('MANAGE_DONATION_TYPES', 'Manage Donation Types')
  .constant('MANAGE_DONATION_CATEGORIES', 'Manage Donation Categories')
  .constant('MANAGE_COMPONENT_COMBINATIONS', 'Manage Component Combinations')
  .constant('MANAGE_CROSS_MATCH_TYPES', 'Manage Cross Match Types')
  .constant('MANAGE_BLOOD_TYPING_RULES', 'Manage Blood Typing Rules')
  .constant('MANAGE_BLOOD_BAG_TYPES', 'Manage Blood Bag Types')
  .constant('MANAGE_DISCARD_REASONS', 'Manage Discard Reasons')
  .constant('MANAGE_DONOR_DEFER_REASONS', 'Manage Donor Defer Reasons')
  .constant('MANAGE_DONOR_CODES', 'Manage Donor Codes')
  .constant('MANAGE_DIAGNOSES_CODES', 'Manage Diagnoses Codes')
  .constant('MANAGE_LAB_SETUP', 'Manage Lab Setup')
  .constant('MANAGE_DATA_SETUP', 'Manage Data Setup')
  .constant('MANAGE_FORMS', 'Manage Forms')
  .constant('MANAGE_BACKUP_DATA', 'Manage Backup Data')
  .constant('MANAGE_BLOOD_TESTS', 'Manage Blood Tests')
  .constant('MANAGE_TIPS', 'Manage Tips')
  .constant('MANAGE_REQUESTS', 'Manage Requests')

  //Page Control Permissions
  .constant('VIEW_DONOR_INFORMATION', 'View Donor Information')
  .constant('VIEW_DONATION_INFORMATION', 'View Donation Information')
  .constant('VIEW_MOBILE_CLINIC_INFORMATION', 'View Mobile Clinic Information')
  .constant('VIEW_COMPONENT_INFORMATION', 'View Component Information')
  .constant('VIEW_TESTING_INFORMATION', 'View Testing Information')
  .constant('VIEW_BLOOD_BANK_INFORMATION', 'View Blood Bank Information')
  .constant('VIEW_INVENTORY_INFORMATION', 'View Inventory Information')
  .constant('VIEW_DISCARD_INFORMATION', 'View Discard Information')
  .constant('VIEW_REPORTING_INFORMATION', 'View Reporting Information')
  .constant('VIEW_ADMIN_INFORMATION', 'View Admin Information')

;
