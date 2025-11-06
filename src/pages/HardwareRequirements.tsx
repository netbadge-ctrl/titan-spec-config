import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Plus, Trash2, Server, Cpu, HardDrive, Database, Zap, Network, ArrowLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// 字段类型定义
type FieldType = "numeric" | "enum";

type Field = {
  key: string;
  label: string;
  type: FieldType;
  enumValues?: string[];
};

// 硬件类别及其字段配置
const hardwareCategories = {
  内存: {
    icon: Database,
    color: "bg-slate-50 dark:bg-slate-800/50",
    fields: [
      { key: "容量(GB)", label: "容量(GB)", type: "numeric" as FieldType },
      { key: "Speed(Mbps)", label: "Speed(Mbps)", type: "numeric" as FieldType },
      { key: "硬件版本", label: "硬件版本", type: "enum" as FieldType, enumValues: ["A1", "A2", "A3", "A4", "A5", "A6"] },
    ],
  },
  网卡: {
    icon: Network,
    color: "bg-slate-50 dark:bg-slate-800/50",
    fields: [
      { key: "硬件版本", label: "硬件版本", type: "enum" as FieldType, enumValues: ["A1", "A2", "A3", "A4", "A5", "A6"] },
    ],
  },
  HDD: {
    icon: HardDrive,
    color: "bg-slate-50 dark:bg-slate-800/50",
    fields: [
      { key: "容量", label: "容量", type: "numeric" as FieldType },
      { key: "接口速率(Gb/s)", label: "接口速率(Gb/s)", type: "numeric" as FieldType },
      { key: "硬件版本", label: "硬件版本", type: "enum" as FieldType, enumValues: ["A1", "A2", "A3", "A4", "A5", "A6"] },
    ],
  },
  SSD: {
    icon: HardDrive,
    color: "bg-slate-50 dark:bg-slate-800/50",
    fields: [
      { key: "容量", label: "容量", type: "numeric" as FieldType },
      { key: "接口速率(Gb/s)", label: "接口速率(Gb/s)", type: "numeric" as FieldType },
      { key: "颗粒类型", label: "颗粒类型", type: "enum" as FieldType, enumValues: ["SLC", "MLC", "TLC", "QLC"] },
      { key: "耐用等级(DEPD)", label: "耐用等级(DEPD)", type: "numeric" as FieldType },
      { key: "硬件版本", label: "硬件版本", type: "enum" as FieldType, enumValues: ["A1", "A2", "A3", "A4", "A5", "A6"] },
    ],
  },
  NVME: {
    icon: HardDrive,
    color: "bg-slate-50 dark:bg-slate-800/50",
    fields: [
      { key: "容量", label: "容量", type: "numeric" as FieldType },
      { key: "接口速率(Gb/s)", label: "接口速率(Gb/s)", type: "numeric" as FieldType },
      { key: "颗粒类型", label: "颗粒类型", type: "enum" as FieldType, enumValues: ["SLC", "MLC", "TLC", "QLC"] },
      { key: "耐用等级", label: "耐用等级", type: "numeric" as FieldType },
      { key: "硬件版本", label: "硬件版本", type: "enum" as FieldType, enumValues: ["A1", "A2", "A3", "A4", "A5", "A6"] },
    ],
  },
};

type Indicator = {
  id: string;
  category: string;
  field: string;
  operator: string;
  value: string | string[]; // 数值型为字符串，枚举型为字符串数组
};

type Rule = {
  id: string;
  serverType: "GPU" | "CPU";
  indicators: Indicator[];
};

const HardwareRequirements = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(isEditMode ? "腾讯云" : "");
  const [serverType, setServerType] = useState<"GPU" | "CPU">("GPU");
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof hardwareCategories>("内存");
  const [selectedField, setSelectedField] = useState("");
  const [operator, setOperator] = useState(">=");
  const [value, setValue] = useState("");
  const [selectedEnumValues, setSelectedEnumValues] = useState<string[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [currentRuleIndicators, setCurrentRuleIndicators] = useState<Indicator[]>([]);

  // 获取当前选中字段的配置
  const currentField = hardwareCategories[selectedCategory].fields.find(f => f.key === selectedField);

  // 模拟客户数据
  const customers = [
    "阿里云",
    "腾讯云",
    "华为云",
    "百度云",
    "字节跳动",
    "京东云",
  ];

  const filteredCustomers = customers.filter((customer) =>
    customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIndicator = () => {
    if (!selectedCustomer || !selectedField) return;

    // 验证：数值型必须有值，枚举型必须有选中项
    if (currentField?.type === "numeric" && !value.trim()) {
      toast({
        title: "请输入数值",
        variant: "destructive",
      });
      return;
    }

    if (currentField?.type === "enum" && selectedEnumValues.length === 0) {
      toast({
        title: "请至少选择一个选项",
        variant: "destructive",
      });
      return;
    }

    // 验证：当前规则中同一硬件类型的同一性能指标只能有一个条件
    const existingIndicator = currentRuleIndicators.find(
      ind => ind.category === selectedCategory && ind.field === selectedField
    );

    if (existingIndicator) {
      toast({
        title: "该性能指标已存在",
        description: "同一规则中同一硬件类型的同一性能指标只能配置一次",
        variant: "destructive",
      });
      return;
    }

    const newIndicator: Indicator = {
      id: Date.now().toString(),
      category: selectedCategory,
      field: selectedField,
      operator: currentField?.type === "numeric" ? ">=" : "=",
      value: currentField?.type === "numeric" ? value : selectedEnumValues,
    };

    setCurrentRuleIndicators([...currentRuleIndicators, newIndicator]);
    setSelectedField("");
    setValue("");
    setSelectedEnumValues([]);
    
    toast({
      title: "指标已添加",
      description: "可以继续添加更多指标或点击'添加规则'保存",
    });
  };

  const handleAddRule = () => {
    if (currentRuleIndicators.length === 0) {
      toast({
        title: "请先添加指标",
        description: "至少需要添加一个指标才能创建规则",
        variant: "destructive",
      });
      return;
    }

    const newRule: Rule = {
      id: Date.now().toString(),
      serverType: serverType,
      indicators: currentRuleIndicators,
    };

    setRules([...rules, newRule]);
    setCurrentRuleIndicators([]);
    setSelectedField("");
    setValue("");
    setSelectedEnumValues([]);
    
    toast({
      title: "规则已添加",
      description: `已添加包含 ${currentRuleIndicators.length} 个指标的规则`,
    });
  };

  // 处理枚举值选择
  const handleEnumValueToggle = (enumValue: string) => {
    setSelectedEnumValues(prev => 
      prev.includes(enumValue)
        ? prev.filter(v => v !== enumValue)
        : [...prev, enumValue]
    );
  };

  // 当字段改变时，重置相关状态
  const handleFieldChange = (fieldKey: string) => {
    setSelectedField(fieldKey);
    setValue("");
    setSelectedEnumValues([]);
    const field = hardwareCategories[selectedCategory].fields.find(f => f.key === fieldKey);
    if (field?.type === "numeric") {
      setOperator(">=");
    } else {
      setOperator("=");
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId));
  };

  const handleDeleteCurrentIndicator = (indicatorId: string) => {
    setCurrentRuleIndicators(currentRuleIndicators.filter((ind) => ind.id !== indicatorId));
  };

  const CategoryIcon = hardwareCategories[selectedCategory].icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* 页面标题和返回按钮 */}
        <div className="mb-6 border-b border-border pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-foreground mb-1">
                  {id ? "编辑" : "新建"}硬件性能指标配置
                </h1>
                <p className="text-sm text-muted-foreground">
                  为客户配置服务器硬件性能最低要求
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 客户选择或显示 */}
        {isEditMode ? (
          <Card className="mb-6 shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                客户信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
                <span className="text-sm font-medium">{selectedCustomer}</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 shadow-sm border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="h-4 w-4 text-muted-foreground" />
                客户选择
              </CardTitle>
              <CardDescription className="text-sm">搜索并选择需要配置的客户</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="输入客户名称进行搜索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              {searchTerm && filteredCustomers.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {filteredCustomers.map((customer) => (
                    <Button
                      key={customer}
                      variant={selectedCustomer === customer ? "default" : "outline"}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setSearchTerm("");
                      }}
                      className="justify-start h-9"
                      size="sm"
                    >
                      {customer}
                    </Button>
                  ))}
                </div>
              )}
              {selectedCustomer && (
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md border">
                  <span className="text-sm font-medium">{selectedCustomer}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCustomer("")}
                    className="h-7 px-2 text-xs"
                  >
                    更换客户
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedCustomer && (
          <>
            {/* 服务器类型选择 */}
            <Card className="mb-6 shadow-sm border">
              <CardHeader>
                <CardTitle className="text-base">服务器类型</CardTitle>
                <CardDescription className="text-sm">选择服务器类型以配置对应的硬件性能指标</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    variant={serverType === "GPU" ? "default" : "outline"}
                    onClick={() => setServerType("GPU")}
                    className="flex-1"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    GPU服务器配置
                  </Button>
                  <Button
                    variant={serverType === "CPU" ? "default" : "outline"}
                    onClick={() => setServerType("CPU")}
                    className="flex-1"
                  >
                    <Cpu className="h-4 w-4 mr-2" />
                    CPU服务器配置
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 硬件类型选择 */}
            <Card className="mb-6 shadow-sm border">
              <CardHeader>
                <CardTitle className="text-base">选择硬件类型</CardTitle>
                <CardDescription className="text-sm">为 {selectedCustomer} 的 {serverType} 服务器配置硬件性能指标</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                  {Object.entries(hardwareCategories).map(([key, config]) => {
                    const Icon = config.icon;
                    const isSelected = selectedCategory === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key as keyof typeof hardwareCategories)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border bg-card hover:border-primary/50 hover:bg-accent/5'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {key}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <Card className={`border ${hardwareCategories[selectedCategory].color}`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <CategoryIcon className="h-4 w-4 text-primary" />
                      添加 {selectedCategory} 性能指标
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* 字段、条件、数值（如果是数值型） */}
                      <div className={`grid gap-3 ${currentField?.type === "numeric" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">字段</Label>
                          <Select value={selectedField} onValueChange={handleFieldChange}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="选择字段" />
                            </SelectTrigger>
                            <SelectContent>
                              {hardwareCategories[selectedCategory].fields.map((field) => (
                                <SelectItem key={field.key} value={field.key}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">条件</Label>
                          <Select value={operator} onValueChange={setOperator} disabled>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value=">=">&gt;=</SelectItem>
                              <SelectItem value="=">=</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedField && currentField?.type === "numeric" && (
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">数值</Label>
                            <Input
                              placeholder="输入数值"
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                              className="h-9"
                              type="number"
                            />
                          </div>
                        )}
                      </div>

                      {/* 枚举多选 */}
                      {selectedField && currentField?.type === "enum" && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">
                            选择选项（多选，选中项为"或"关系）
                          </Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {currentField.enumValues?.map((enumValue) => (
                              <div
                                key={enumValue}
                                className="flex items-center space-x-2 p-2 rounded-md border bg-card hover:bg-accent/5 cursor-pointer"
                                onClick={() => handleEnumValueToggle(enumValue)}
                              >
                                <Checkbox
                                  checked={selectedEnumValues.includes(enumValue)}
                                  onCheckedChange={() => handleEnumValueToggle(enumValue)}
                                />
                                <label className="text-sm cursor-pointer flex-1">
                                  {enumValue}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 添加指标和添加规则按钮 */}
                      {selectedField && (
                        <div className="grid grid-cols-2 gap-3">
                          <Button onClick={handleAddIndicator} variant="outline" className="h-9" size="sm">
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            添加指标
                          </Button>
                          <Button onClick={handleAddRule} className="h-9" size="sm">
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            添加规则
                          </Button>
                        </div>
                      )}

                      {/* 已添加的指标列表 */}
                      {currentRuleIndicators.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <Label className="text-xs text-muted-foreground">
                            已添加 {currentRuleIndicators.length} 个指标（指标间为且的关系）
                          </Label>
                          <div className="space-y-2">
                            {currentRuleIndicators.map((ind) => {
                              const IndicatorIcon = hardwareCategories[ind.category as keyof typeof hardwareCategories].icon;
                              
                              return (
                                <div
                                  key={ind.id}
                                  className="flex items-center justify-between p-2 rounded-md border bg-card"
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    <IndicatorIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                    <Badge variant="secondary" className="text-xs font-normal">
                                      {ind.category}
                                    </Badge>
                                    <span className="text-xs text-foreground">
                                      {ind.field} {ind.operator}{" "}
                                      {Array.isArray(ind.value) 
                                        ? ind.value.join(" 或 ")
                                        : ind.value
                                      }
                                    </span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleDeleteCurrentIndicator(ind.id)}
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>


            {/* 性能指标规则 */}
            {rules.length > 0 && (
              <Card className="shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-base">性能指标规则</CardTitle>
                  <CardDescription className="text-sm">
                    已添加 {rules.length} 个规则 · 规则间为或的关系，满足任意一条规则即可
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rules.map((rule, ruleIndex) => (
                      <div key={rule.id} className="border rounded-lg p-4 bg-muted/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">规则 {ruleIndex + 1}</span>
                            <Badge variant={rule.serverType === "GPU" ? "default" : "secondary"} className="text-xs">
                              {rule.serverType}服务器指标规则
                            </Badge>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认删除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  确定要删除该规则吗？此操作无法撤销。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRule(rule.id)}>
                                  删除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        <div className="space-y-2">
                          {rule.indicators.map((ind) => {
                            const CategoryIcon = hardwareCategories[ind.category as keyof typeof hardwareCategories].icon;
                            
                            return (
                              <div
                                key={ind.id}
                                className="flex items-center gap-3 p-2 rounded-md bg-card"
                              >
                                <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                                <Badge variant="outline" className="text-xs font-normal">
                                  {ind.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">字段:</span>
                                <span className="text-sm text-foreground font-medium">{ind.field}</span>
                                <span className="text-xs text-muted-foreground">条件:</span>
                                <span className="text-sm text-foreground">{ind.operator}</span>
                                <span className="text-xs text-muted-foreground">数值:</span>
                                <span className="text-sm text-foreground font-medium">
                                  {Array.isArray(ind.value) 
                                    ? ind.value.join(" 或 ")
                                    : ind.value
                                  }
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* 底部操作按钮 */}
        {selectedCustomer && (
          <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border">
            <Button variant="outline" onClick={() => navigate("/")}>
              取消
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              保存配置
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HardwareRequirements;
