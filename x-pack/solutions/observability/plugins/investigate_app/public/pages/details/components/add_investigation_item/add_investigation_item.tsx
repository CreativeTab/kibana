/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiIcon, EuiPanel, EuiTitle } from '@elastic/eui';
import { css } from '@emotion/css';
import { ESQLLangEditor } from '@kbn/esql/public';
import { i18n } from '@kbn/i18n';
import React from 'react';
import { useInvestigation } from '../../contexts/investigation_context';
import { AddFromLibraryButton } from '../add_from_library_button';
import { EsqlWidgetPreview } from './esql_widget_preview';

const emptyPreview = css`
  padding: 36px 0px 36px 0px;
`;

export function AddInvestigationItem() {
  const { addItem, globalParams } = useInvestigation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState({ esql: '' });
  const [submittedQuery, setSubmittedQuery] = React.useState({ esql: '' });
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const resetState = () => {
    setIsPreviewOpen(false);
    setQuery({ esql: '' });
    setSubmittedQuery({ esql: '' });
  };

  if (!isOpen) {
    return (
      <EuiFlexGroup gutterSize="s" direction="row" alignItems="flexEnd">
        <EuiFlexItem grow={true}>
          <EuiButton
            data-test-subj="investigateAppAddObservationUIAddAnObservationChartButton"
            iconType="plusInCircle"
            onClick={() => setIsOpen(true)}
          >
            {i18n.translate(
              'xpack.investigateApp.addObservationUI.addAnObservationChartButtonLabel',
              { defaultMessage: 'Add an observation chart' }
            )}
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }

  return (
    <EuiPanel paddingSize="l" grow={false}>
      <EuiFlexGroup direction="column" gutterSize="m">
        <EuiFlexItem grow={true}>
          <EuiTitle size="s">
            <h3>
              {i18n.translate(
                'xpack.investigateApp.addObservationUI.h2.addAnObservationChartLabel',
                { defaultMessage: 'Add an observation chart' }
              )}
            </h3>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem grow={true}>
          <EuiPanel color="subdued" hasShadow={false}>
            <EuiFlexGroup gutterSize="m">
              <EuiFlexItem>
                <ESQLLangEditor
                  query={query}
                  onTextLangQueryChange={setQuery}
                  onTextLangQuerySubmit={async (nextSubmittedQuery) => {
                    if (nextSubmittedQuery) {
                      setSubmittedQuery(nextSubmittedQuery);
                      setIsPreviewOpen(true);
                    }
                  }}
                  errors={undefined}
                  warning={undefined}
                  editorIsInline={false}
                  hideRunQueryText
                  isLoading={false}
                  disableSubmitAction
                  isDisabled={false}
                  hideTimeFilterInfo
                />
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <AddFromLibraryButton
                  onItemAdd={async (item) => {
                    resetState();
                    await addItem(item);
                  }}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
            {!isPreviewOpen ? (
              <EuiFlexGroup
                direction="column"
                alignItems="center"
                gutterSize="l"
                className={emptyPreview}
              >
                <EuiFlexItem grow={false}>
                  <EuiIcon type="image" size="xxl" />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <p>
                    {i18n.translate(
                      'xpack.investigateApp.addObservationUI.p.selectADataSourceLabel',
                      { defaultMessage: 'Select a data source to generate a preview chart' }
                    )}
                  </p>
                </EuiFlexItem>
              </EuiFlexGroup>
            ) : (
              <EsqlWidgetPreview
                esqlQuery={submittedQuery.esql}
                timeRange={globalParams.timeRange}
                onItemAdd={async (item) => {
                  resetState();
                  await addItem(item);
                }}
              />
            )}
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiButton
              color="text"
              data-test-subj="investigateAppAddObservationUICancelButton"
              onClick={() => {
                resetState();
                setIsOpen(false);
              }}
            >
              {i18n.translate('xpack.investigateApp.addObservationUI.cancelButtonLabel', {
                defaultMessage: 'Cancel',
              })}
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexGroup>
    </EuiPanel>
  );
}
