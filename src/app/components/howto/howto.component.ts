/*
 * Software Name : SuperCodingBall
 * Version: 1.0.0
 * SPDX-FileCopyrightText: Copyright (c) 2021 Orange
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * This software is distributed under the BSD 3-Clause "New" or "Revised" License,
 * the text of which is available at https://spdx.org/licenses/BSD-3-Clause.html
 * or see the "LICENSE.txt" file for more details.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HowtoDemoComponent} from '../howto-demo/howto-demo.component';
import Blockly from 'blockly';
import {CodeService} from '../../services/code.service';
import {WorkspaceSvg} from 'blockly';
import {TouchDevicesService} from '../../services/touch-devices.service';

@Component({
  selector: 'app-howto',
  templateUrl: './howto.component.html'
})
export class HowtoComponent implements OnInit, OnDestroy {
  private shootWorkspace!: Blockly.WorkspaceSvg;
  private passWorkspace!: Blockly.WorkspaceSvg;
  private shootOrPassWorkspace!: Blockly.WorkspaceSvg;

  constructor(
    private modalService: NgbModal,
    private codeService: CodeService,
    public touchDevicesService: TouchDevicesService) {
  }

  ngOnInit(): void {
    this.shootWorkspace = this.getWorkspaceForViewing('blocklyShootDiv');
    this.loadStrategy(this.shootWorkspace, 'howto-shoot');
    this.passWorkspace = this.getWorkspaceForViewing('blocklyPassDiv');
    this.loadStrategy(this.passWorkspace, 'howto-pass');
    this.shootOrPassWorkspace = this.getWorkspaceForViewing('blocklyShootOrPassDiv');
    this.loadStrategy(this.shootOrPassWorkspace, 'howto-shoot-or-pass');
  }

  getWorkspaceForViewing(divId: string): WorkspaceSvg {
    const blocklyDiv = document.getElementById(divId)!;
    return CodeService.getWorkspace(
      blocklyDiv,
      {
        readOnly: true,
        move: {
          scrollbars: {horizontal: false, vertical: true},
          drag: false,
          wheel: false
        },
        theme: this.codeService.customDarkTheme,
        zoom: {
          controls: false,
          wheel: false,
          pinch: false
        }
      });
  }

  loadStrategy(workspace: WorkspaceSvg, strategyId: string): void {
    this.codeService.loadOppBlocks(false, strategyId)
      .then(blocks => {
        this.codeService.loadBlocksInWorkspace(blocks, workspace)
        workspace.zoomToFit();
        workspace.scrollbar?.setContainerVisible(false);
      });
  }

  openDemo(): void {
    this.modalService.open(HowtoDemoComponent, {size: 'xl'});
  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
    this.shootWorkspace.dispose();
    this.passWorkspace.dispose();
    this.shootOrPassWorkspace.dispose();
  }
}
