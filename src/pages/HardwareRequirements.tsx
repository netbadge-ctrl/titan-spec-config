import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Plus, Trash2, Edit, Server, Cpu, HardDrive, Database, Zap, Network, ArrowLeft, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 硬件类别及其字段配置
const hardwareCategories = {
  CPU: {
    icon: Cpu,
    color: "bg-slate-50 dark:bg-slate-800/50",
    fields: [
      { key: "规格", label: "规格" },
      { key: "引入状态", label: "引入状态" },
      { key: "状态", label: "状态" },
      { key: "厂", label: "厂商" },
      { key: "架构", label: "架构" },
      { key: "内核数", label: "内核数" },
      { key: "线程数", label: "线程数" },
      { key: "睿频(GHz)", label: "睿频(GHz)" },
      { key: "基频(GHz)", label: "基频(GHz)" },
      { key: "内存类型", label: "内存类型" },
      { key: "最大功耗(W)", label: "最大功耗(W)" },
    ],
  },
  Memory: {
    icon: Database,
    color: "bg-blue-50 dark:bg-blue-900/20",
    fields: [
      { key: "规格", label: "规格" },
      { key: "引入状态", label: "引入状态" },
      { key: "状态", label: "状态" },
      { key: "厂商", label: "厂商" },
      { key: "容量(GB)", label: "容量(GB)" },
      { key: "Speed(Mbps)", label: "Speed(Mbps)" },
      { key: "ddr", label: "DDR类型" },
      { key: "DIMM类型", label: "DIMM类型" },
      { key: "Rank", label: "Rank" },
      { key: "最大功耗(W)", label: "最大功耗(W)" },
    ],
  },
  NIC: {
    icon: Network,
    color: "bg-indigo-50 dark:bg-indigo-900/20",
    fields: [
      { key: "规格", label: "规格" },
      { key: "引入状态", label: "引入状态" },
      { key: "状态", label: "状态" },
      { key: "厂商", label: "厂商" },
      { key: "link类型", label: "Link类型" },
      { key: "link宽度", label: "Link宽度" },
      { key: "介质类型", label: "介质类型" },
      { key: "模块类型", label: "模块类型" },
      { key: "电口数量", label: "电口数量" },
      { key: "光口数量", label: "光口数量" },
      { key: "最大功耗(W)", label: "最大功耗(W)" },
    ],
  },
  Storage: {
    icon: HardDrive,
    color: "bg-gray-50 dark:bg-gray-800/50",
    fields: [
      { key: "规格", label: "规格" },
      { key: "引入状态", label: "引入状态" },
      { key: "状态", label: "状态" },
      { key: "厂商", label: "厂商" },
      { key: "容量", label: "容量" },
      { key: "盘体尺寸", label: "盘体尺寸" },
      { key: "物理接口", label: "物理接口" },
      { key: "接口速度(Gb/s)", label: "接口速度(Gb/s)" },
      { key: "顺序读(MB/s)", label: "顺序读(MB/s)" },
      { key: "顺序写(MB/s)", label: "顺序写(MB/s)" },
      { key: "最大功耗(W)", label: "最大功耗(W)" },
    ],
  },
  GPU: {
    icon: Zap,
    color: "bg-purple-50 dark:bg-purple-900/20",
    fields: [
      { key: "规格", label: "规格" },
      { key: "引入状态", label: "引入状态" },
      { key: "状态", label: "状态" },
      { key: "厂商", label: "厂商" },
      { key: "显存容量", label: "显存容量" },
      { key: "显存类型", label: "显存类型" },
      { key: "link类型", label: "Link类型" },
      { key: "link宽度", label: "Link宽度" },
      { key: "是否带桥接接口", label: "是否带桥接接口" },
      { key: "最大功耗(W)", label: "最大功耗(W)" },
    ],
  },
  RAID: {
    icon: Server,
    color: "bg-cyan-50 dark:bg-cyan-900/20",
    fields: [
      { key: "规格", label: "规格" },
      { key: "引入状态", label: "引入状态" },
      { key: "状态", label: "状态" },
      { key: "厂商", label: "厂商" },
      { key: "raid卡类型", label: "RAID卡类型" },
      { key: "支持raid类型", label: "支持RAID类型" },
      { key: "接口类型", label: "接口类型" },
      { key: "接口数量", label: "接口数量" },
      { key: "内置盘口", label: "内置盘口" },
      { key: "缓存容量", label: "缓存容量" },
    ],
  },
};

type Requirement = {
  id: string;
  category: string;
  field: string;
  operator: string;
  value: string;
};

const HardwareRequirements = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof hardwareCategories>("CPU");
  const [selectedField, setSelectedField] = useState("");
  const [operator, setOperator] = useState(">=");
  const [value, setValue] = useState("");
  const [requirements, setRequirements] = useState<Requirement[]>([]);

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

  const handleAddRequirement = () => {
    if (!selectedCustomer || !selectedField || !value) return;

    const newRequirement: Requirement = {
      id: Date.now().toString(),
      category: selectedCategory,
      field: selectedField,
      operator,
      value,
    };

    setRequirements([...requirements, newRequirement]);
    setSelectedField("");
    setValue("");
  };

  const handleDeleteRequirement = (id: string) => {
    setRequirements(requirements.filter((req) => req.id !== id));
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
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                取消
              </Button>
              <Button size="sm">
                <Save className="h-3.5 w-3.5 mr-1.5" />
                保存配置
              </Button>
            </div>
          </div>
        </div>

        {/* 客户选择 */}
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {filteredCustomers.map((customer) => (
                <Button
                  key={customer}
                  variant={selectedCustomer === customer ? "default" : "outline"}
                  onClick={() => setSelectedCustomer(customer)}
                  className="justify-start h-9"
                  size="sm"
                >
                  {customer}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedCustomer && (
          <>
            {/* 硬件类型选择 */}
            <Card className="mb-6 shadow-sm border">
              <CardHeader>
                <CardTitle className="text-base">硬件类型选择</CardTitle>
                <CardDescription className="text-sm">为 {selectedCustomer} 配置硬件性能指标</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as keyof typeof hardwareCategories)}>
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-muted/50">
                    {Object.entries(hardwareCategories).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <TabsTrigger key={key} value={key} className="gap-1.5 text-sm">
                          <Icon className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">{key}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  {Object.keys(hardwareCategories).map((key) => (
                    <TabsContent key={key} value={key} className="mt-4">
                      <Card className={`border ${hardwareCategories[key as keyof typeof hardwareCategories].color}`}>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                            添加 {key} 性能指标
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">字段</Label>
                              <Select value={selectedField} onValueChange={setSelectedField}>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="选择字段" />
                                </SelectTrigger>
                                <SelectContent>
                                  {hardwareCategories[key as keyof typeof hardwareCategories].fields.map((field) => (
                                    <SelectItem key={field.key} value={field.key}>
                                      {field.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">条件</Label>
                              <Select value={operator} onValueChange={setOperator}>
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value=">=">&gt;=</SelectItem>
                                  <SelectItem value="<=">&lt;=</SelectItem>
                                  <SelectItem value="=">=</SelectItem>
                                  <SelectItem value=">>">&gt;</SelectItem>
                                  <SelectItem value="<">&lt;</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">数值</Label>
                              <Input
                                placeholder="输入数值"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="h-9"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label className="invisible text-xs">操作</Label>
                              <Button onClick={handleAddRequirement} className="w-full h-9" size="sm">
                                <Plus className="h-3.5 w-3.5 mr-1.5" />
                                添加
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* 已配置列表 */}
            {requirements.length > 0 && (
              <Card className="shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-base">已配置的性能指标</CardTitle>
                  <CardDescription className="text-sm">
                    客户: {selectedCustomer} | 共 {requirements.length} 条配置
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {requirements.map((req) => {
                      const CategoryIcon = hardwareCategories[req.category as keyof typeof hardwareCategories].icon;
                      const colorClass = hardwareCategories[req.category as keyof typeof hardwareCategories].color;
                      
                      return (
                        <div
                          key={req.id}
                          className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/5 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`p-1.5 rounded ${colorClass} border`}>
                              <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <Badge variant="secondary" className="mb-1 text-xs font-normal">
                                {req.category}
                              </Badge>
                              <p className="text-sm text-foreground">
                                {req.field} {req.operator} {req.value}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteRequirement(req.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HardwareRequirements;
